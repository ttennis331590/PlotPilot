import React, { useState, useEffect } from "react";
import { Box, Columns, Button, Table, Content } from 'react-bulma-components';
import { useUser } from './UserContext';

function TrackedChangesBox({ fileDiff }) {
  
  return (
    <div className="file-changes-box tracked-changes-box">
      <div
        className="file-changes-content"
        dangerouslySetInnerHTML={{ __html: fileDiff }}
      ></div>
    </div>
  );
}

export default TrackedChangesBox;
