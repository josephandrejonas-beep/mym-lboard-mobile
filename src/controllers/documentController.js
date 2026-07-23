// Document Controller
// File: src/controllers/documentController.js

const pool = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

const documentController = {
  // Upload document
  uploadDocument: async (req, res) => {
    try {
      const { loadId } = req.params;
      const { documentType } = req.body; // BOL, POD, etc.
      const driverId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Verify driver has access to this load
      const loadCheck = await pool.query(
        'SELECT * FROM loads WHERE id = $1 AND driver_id = $2',
        [loadId, driverId]
      );

      if (loadCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied to this load' });
      }

      // Insert document record into database
      const result = await pool.query(
        `INSERT INTO load_documents 
         (load_id, driver_id, document_type, file_name, file_path, file_size, mime_type, uploaded_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING id, file_name, file_path, uploaded_at`,
        [
          loadId,
          driverId,
          documentType || 'GENERAL',
          req.file.originalname,
          req.file.path,
          req.file.size,
          req.file.mimetype,
        ]
      );

      res.status(201).json({
        message: 'Document uploaded successfully',
        document: result.rows[0],
      });
    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({ error: 'Failed to upload document' });
    }
  },

  // Get load documents
  getLoadDocuments: async (req, res) => {
    try {
      const { loadId } = req.params;
      const driverId = req.user.id;

      const result = await pool.query(
        `SELECT * FROM load_documents 
         WHERE load_id = $1 AND driver_id = $2
         ORDER BY uploaded_at DESC`,
        [loadId, driverId]
      );

      res.json({
        documents: result.rows,
        count: result.rows.length,
      });
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ error: 'Failed to retrieve documents' });
    }
  },

  // Delete document
  deleteDocument: async (req, res) => {
    try {
      const { documentId } = req.params;
      const driverId = req.user.id;

      // Get document info
      const docResult = await pool.query(
        'SELECT * FROM load_documents WHERE id = $1 AND driver_id = $2',
        [documentId, driverId]
      );

      if (docResult.rows.length === 0) {
        return res.status(403).json({ error: 'Document not found or access denied' });
      }

      const document = docResult.rows[0];

      // Delete file from storage
      try {
        await fs.unlink(document.file_path);
      } catch (fsError) {
        console.error('File deletion error:', fsError);
      }

      // Delete database record
      await pool.query(
        'DELETE FROM load_documents WHERE id = $1',
        [documentId]
      );

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  },

  // Download document
  downloadDocument: async (req, res) => {
    try {
      const { documentId } = req.params;
      const driverId = req.user.id;

      const result = await pool.query(
        'SELECT * FROM load_documents WHERE id = $1 AND driver_id = $2',
        [documentId, driverId]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'Document not found or access denied' });
      }

      const document = result.rows[0];
      res.download(document.file_path, document.file_name);
    } catch (error) {
      console.error('Download document error:', error);
      res.status(500).json({ error: 'Failed to download document' });
    }
  },
};

module.exports = documentController;
