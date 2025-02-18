import React from 'react';
import BulkUploadForm from './BulkUploadForm';
import AttachSessionDetails from '@/components/AttachSessionDetails';

const BulkUploadPage = async ({ params }) => {
  const id = (await params).id;
  return (
    <div>
      <AttachSessionDetails id={id} Component={BulkUploadForm} />
    </div>
  );
};

export default BulkUploadPage;