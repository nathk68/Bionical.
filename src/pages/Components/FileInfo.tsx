import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface FileInfoProps {
  name: string;
  type: string;
  size: number;
  file: File;
}

const FileInfo: React.FC<FileInfoProps> = ({ name, type, size, file }) => {
  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileExtension = (type: string) => {
    switch (type) {
      case 'text/plain':
        return 'TXT';
      case 'application/pdf':
        return 'PDF';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'DOCX';
      default:
        return type.split('/')[1].toUpperCase();
    }
  };

  const truncateName = (name: string) => {
    const extension = name.slice(name.lastIndexOf('.'));
    if (name.length > 15) {
      return `${name.substring(0, 12)}..${extension}`;
    }
    return name;
  };

  return (
    <Paper elevation={3} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, width: "250px", height:"50px", marginBottom:'8px', marginTop:'8px' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          backgroundColor: '#E0E0E0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mr: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {getFileExtension(type)}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body1"><strong>{truncateName(name)}</strong></Typography>
        <Typography variant="body2" color="textSecondary">{formatSize(size)}</Typography>
      </Box>
    </Paper>
  );
};

export default FileInfo;
