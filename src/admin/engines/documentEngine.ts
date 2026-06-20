/**
 * Document Engine
 * Handles file uploads, storage management, and document retrieval
 * Independent engine — does not depend on other engines.
 * Pure TypeScript — no React, no JSX.
 */

import { Document } from '../types/appointment.types';
import { logger } from '../utils/logger';

type DocumentType =
  | 'REFERRAL_LETTER'
  | 'ID_DOCUMENT'
  | 'MEDICAL_RECORDS'
  | 'ASSESSMENT_FORM'
  | 'MEDICO_LEGAL_REPORT'
  | 'INVOICE'
  | 'RECEIPT'
  | 'COURT_ORDER'
  | 'CONSENT_FORM'
  | 'OTHER';

interface UploadDocumentPayload {
  appointment_id: string;
  file: File | Blob;
  file_name: string;
  doc_type: DocumentType;
  uploaded_by: string;
}

interface DocumentMetadata {
  id: string;
  appointment_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  doc_type: DocumentType;
  storage_path: string;
  uploaded_at: string;
  uploaded_by: string;
}

interface SignedUrlResponse {
  signed_url: string;
  expires_in_seconds: number;
}

export class DocumentEngine {
  private static readonly STORAGE_BUCKET = 'appointment-documents';

  /**
   * Upload a document to Supabase Storage
   * @param payload - Upload details including file, appointment ID, and metadata
   * @returns Promise<DocumentMetadata> - Document record and storage path
   */
  static async uploadDocument(payload: UploadDocumentPayload): Promise<DocumentMetadata> {
    try {
      const { appointment_id, file, file_name, doc_type, uploaded_by } = payload;

      // Validate inputs
      if (!appointment_id || !file || !file_name || !doc_type || !uploaded_by) {
        throw new Error('Missing required document upload fields');
      }

      // Generate storage path: appointments/{appointment_id}/{doc_type}/{timestamp}_{filename}
      const timestamp = Date.now();
      const storagePath = `appointments/${appointment_id}/${doc_type}/${timestamp}_${file_name}`;

      // TODO: Replace with actual Supabase Storage upload
      // const { data, error } = await supabase.storage
      //   .from(this.STORAGE_BUCKET)
      //   .upload(storagePath, file, {
      //     cacheControl: '3600',
      //     upsert: false,
      //   });

      // TODO: Insert document metadata into database
      // const { data: docData, error: dbError } = await supabase
      //   .from('documents')
      //   .insert([{
      //     appointment_id,
      //     file_name,
      //     file_type: file.type,
      //     file_size: file.size,
      //     doc_type,
      //     storage_path: storagePath,
      //     uploaded_by,
      //   }])
      //   .select()
      //   .single();

      const metadata: DocumentMetadata = {
        id: `doc_${timestamp}`,
        appointment_id,
        file_name,
        file_type: (file as any).type || 'application/octet-stream',
        file_size: (file as any).size || 0,
        doc_type,
        storage_path: storagePath,
        uploaded_at: new Date().toISOString(),
        uploaded_by,
      };

      logger.info('Document uploaded', {
        appointment_id,
        doc_type,
        file_size: metadata.file_size,
      });

      return metadata;
    } catch (error) {
      logger.error('Failed to upload document', error as Error, {
        appointment_id: payload.appointment_id,
        doc_type: payload.doc_type,
      });
      throw error;
    }
  }

  /**
   * Get all documents for an appointment
   * @param appointmentId - Appointment ID
   * @returns Promise<DocumentMetadata[]> - All documents attached to appointment
   */
  static async getDocuments(appointmentId: string): Promise<DocumentMetadata[]> {
    try {
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('documents')
      //   .select('*')
      //   .eq('appointment_id', appointmentId)
      //   .order('uploaded_at', { ascending: false });

      logger.info('Documents retrieved for appointment', { appointment_id: appointmentId });

      return [];
    } catch (error) {
      logger.error('Failed to get documents', error as Error, { appointment_id: appointmentId });
      throw error;
    }
  }

  /**
   * Get documents filtered by type
   * @param appointmentId - Appointment ID
   * @param docType - Document type filter
   * @returns Promise<DocumentMetadata[]> - Filtered documents
   */
  static async getDocumentsByType(appointmentId: string, docType: DocumentType): Promise<DocumentMetadata[]> {
    try {
      // TODO: Replace with actual Supabase query with filter
      // const { data, error } = await supabase
      //   .from('documents')
      //   .select('*')
      //   .eq('appointment_id', appointmentId)
      //   .eq('doc_type', docType)
      //   .order('uploaded_at', { ascending: false });

      logger.info('Documents retrieved by type', {
        appointment_id: appointmentId,
        doc_type: docType,
      });

      return [];
    } catch (error) {
      logger.error('Failed to get documents by type', error as Error, {
        appointment_id: appointmentId,
        doc_type: docType,
      });
      throw error;
    }
  }

  /**
   * Generate a temporary signed URL for downloading a document
   * Expires after specified time to prevent unauthorized sharing
   * @param documentPath - Storage path of document
   * @param expiresInSeconds - URL expiry time (default 3600 = 1 hour)
   * @returns Promise<SignedUrlResponse> - Temporary download URL
   */
  static async getSignedUrl(documentPath: string, expiresInSeconds: number = 3600): Promise<SignedUrlResponse> {
    try {
      // Validate inputs
      if (!documentPath || expiresInSeconds <= 0) {
        throw new Error('Invalid document path or expiry time');
      }

      // TODO: Replace with actual Supabase signed URL generation
      // const { data, error } = await supabase.storage
      //   .from(this.STORAGE_BUCKET)
      //   .createSignedUrl(documentPath, expiresInSeconds);

      logger.info('Signed URL generated', {
        document_path: documentPath,
        expires_in_seconds: expiresInSeconds,
      });

      return {
        signed_url: '',
        expires_in_seconds: expiresInSeconds,
      };
    } catch (error) {
      logger.error('Failed to generate signed URL', error as Error, { document_path: documentPath });
      throw error;
    }
  }

  /**
   * Delete a document (soft delete by marking is_deleted = true)
   * Includes audit trail of who deleted and when
   * @param documentId - Document ID
   * @param actorId - User ID of person deleting
   * @returns Promise<void>
   */
  static async deleteDocument(documentId: string, actorId: string): Promise<void> {
    try {
      // TODO: Replace with actual Supabase soft delete
      // const { error } = await supabase
      //   .from('documents')
      //   .update({ is_deleted: true, deleted_by: actorId, deleted_at: new Date().toISOString() })
      //   .eq('id', documentId);

      logger.info('Document deleted', {
        document_id: documentId,
        actor_id: actorId,
      });
    } catch (error) {
      logger.error('Failed to delete document', error as Error, {
        document_id: documentId,
        actor_id: actorId,
      });
      throw error;
    }
  }

  /**
   * Validate file before upload
   * Checks file size, type, and naming
   * @param file - File to validate
   * @param fileName - File name
   * @returns { valid: boolean; error?: string }
   */
  static validateFile(file: File | Blob, fileName: string): { valid: boolean; error?: string } {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
    const ALLOWED_TYPES = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!fileName || fileName.trim().length === 0) {
      return { valid: false, error: 'File name is required' };
    }

    if ((file as any).size > MAX_FILE_SIZE) {
      return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
    }

    if (!ALLOWED_TYPES.includes((file as any).type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    return { valid: true };
  }

  /**
   * Get storage statistics for an appointment
   * Total documents and total storage used
   * @param appointmentId - Appointment ID
   * @returns Promise<{ count: number; total_size_bytes: number }>
   */
  static async getStorageStats(appointmentId: string): Promise<{ count: number; total_size_bytes: number }> {
    try {
      const documents = await this.getDocuments(appointmentId);
      const totalSize = documents.reduce((sum, doc) => sum + doc.file_size, 0);

      logger.info('Storage stats retrieved', {
        appointment_id: appointmentId,
        document_count: documents.length,
        total_size_bytes: totalSize,
      });

      return {
        count: documents.length,
        total_size_bytes: totalSize,
      };
    } catch (error) {
      logger.error('Failed to get storage stats', error as Error, { appointment_id: appointmentId });
      throw error;
    }
  }
}

export default DocumentEngine;
