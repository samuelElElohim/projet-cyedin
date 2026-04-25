import { useForm, router } from '@inertiajs/react'
import { useState } from 'react'
import DocumentUpload from '@/Components/DocumentUpload'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'


export default function EtuDocuments({ documents }) {
    
    return (
               <>
                   <AuthenticatedLayout>
                   <DocumentUpload documents={documents}/>
                   </AuthenticatedLayout>
               </>
    )
}