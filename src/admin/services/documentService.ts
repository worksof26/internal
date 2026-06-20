/**
 * Document Service
 * Thin Supabase wrapper layer for document operations
 * Calls documentEngine methods and handles Supabase Storage connectivity
 */

import DocumentEngine from '../engines/documentEngine';
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
  appointmentId: string;
  file: File;
  docType: DocumentType;
  uploadedBy: string;
}

export class DocumentService {
  /**
   * Upload document to Supabase Storage and create document record
   * @param payload - Upload details
   * @returns Promise<Document>
   */
  static async uploadDocument(payload: UploadDocumentPayload): Promise<Document> {
    try {
      // TODO: Upload file to Supabase Storage
      // const storagePath = `appointments/${payload.appointmentId}/${payload.docType}/${payload.file.name}`;
      // const { data, error } = await supabase.storage
      //   .from('documents')
      //   .upload(storagePath, payload.file);

      const result = await DocumentEngine.uploadDocument({ appointment_id: payload.appointmentId, file: payload.file, file_name: payload.file.name, doc_type: payload.docType, uploaded_by: payload.uploadedBy });

      // TODO: Insert metadata into Supabase 'documents' table
      // const { data: docData, error: docError } = await supabase
      //   .from('documents')
      //   .insert([{
      //     appointment_id: payload.appointmentId,
      //     file_name: payload.file.name,
      //     file_type: payload.file.type,
      //     file_size: payload.file.size,
      //     doc_type: payload.docType,
      //     storage_path: storagePath,
      //     uploaded_by: payload.uploadedBy,
      //   }])
      //   .select()
      //   .single();

      logger.info('Document uploaded via service', {
        appointment_id: payload.appointmentId,
        doc_type: payload.docType,
        file_name: payload.file.name,
      });

      return result;
    } catch (error) {
      logger.error('Document service: Failed to upload document', error as Error);
      throw error;
    }
  }

  /**
   * Get documents for appointment
   * @param appointmentId - Appointment ID
   * @returns Promise<Document[]>
   */
  static async getDocuments(appointmentId: string): Promise<Document[]> {
    try {
      // TODO: Fetch from Supabase 'documents' table
      // const { data, error } = await supabase
      //   .from('documents')
      //   .select('*')
      //   .eq('appointment_id', appointmentId)
      //   .eq('is_deleted', false)
      //   .order('uploaded_at', { ascending: false });

      const result = await DocumentEngine.getDocuments(appointmentId);

      logger.info('Documents retrieved via service', {
        appointment_id: appointmentId,
      });

      return result;
    } catch (error) {
      logger.error('Document service: Failed to get documents', error as Error);
      throw error;
    }
  }

  /**
   * Delete document (soft delete)
   * @param documentId - Document ID
   * @param actorId - User ID
   * @returns Promise
   */
  static async deleteDocument(documentId: string, actorId: string): Promise<Awaited<ReturnType<typeof DocumentEngine.deleteDocument>>> {
    try {
      // TODO: Soft delete from Supabase (update is_deleted = true)
      // const { data, error } = await supabase
      //   .from('documents')
      //   .update({ is_deleted: true, deleted_at: new Date().toISOString(), deleted_by: actorId })
      //   .eq('id', documentId)
      //   .select()
      //   .single();

      const result = await DocumentEngine.deleteDocument(documentId, actorId);

      logger.info('Document deleted via service', {
        document_id: documentId,
      });

      return result;
    } catch (error) {
      logger.error('Document service: Failed to delete document', error as Error);
      throw error;
    }
  }

  /**
   * Get signed URL for document download
   * @param documentPath - Storage path
   * @param expiresIn - Expiration time in seconds
   * @returns Promise<string>
   */
  static async getSignedUrl(documentPath: string, expiresIn: number = 3600): Promise<string> {
    try {
      // TODO: Get signed URL from Supabase Storage
      // const { data, error } = await supabase.storage
      //   .from('documents')
      //   .createSignedUrl(documentPath, expiresIn);

      const result = await DocumentEngine.getSignedUrl(documentPath, expiresIn);

      logger.info('Signed URL generated via service', {
        document_path: documentPath,
      });

      return result.signed_url;
    } catch (error) {
      logger.error('Document service: Failed to get signed URL', error as Error);
      throw error;
    }
  }

  /**
   * Get documents by type for appointment
   * @param appointmentId - Appointment ID
   * @param docType - Document type
   * @returns Promise<Document[]>
   */
  static async getDocumentsByType(appointmentId: string, docType: DocumentType): Promise<Document[]> {
    try {
      // TODO: Fetch from Supabase 'documents' table with type filter
      // const { data, error } = await supabase
      //   .from('documents')
      //   .select('*')
      //   .eq('appointment_id', appointmentId)
      //   .eq('doc_type', docType)
      //   .eq('is_deleted', false)
      //   .order('uploaded_at', { ascending: false });

      const result = await DocumentEngine.getDocumentsByType(appointmentId, docType);

      logger.info('Documents retrieved by type via service', {
        appointment_id: appointmentId,
        doc_type: docType,
      });

      return result;
    } catch (error) {
      logger.error('Document service: Failed to get documents by type', error as Error);
      throw error;
    }
  }
}

export default DocumentService;