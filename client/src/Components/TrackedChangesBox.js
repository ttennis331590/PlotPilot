import React, { useState, useEffect, useRef } from "react";
import { Box, Columns, Button, Table, Content } from 'react-bulma-components';


function TrackedChangesBox(fileDiff) {
    const fileChangesContentRef = useRef(null);

    useEffect(() => {
        if (fileChangesContentRef.current) {
          fileChangesContentRef.current.innerHTML = fileDiff.fileDiff;
        }
        console.log(fileDiff)
      }, [fileDiff]);

  return (
    <Box className="file-changes-box file-ui-box">
      <p className="file-ui-box-header-text">File Changes</p>
      <div ref={fileChangesContentRef} className="file-changes-content"></div>
    </Box>
  );
}

export default TrackedChangesBox;
