import React, { useState, useEffect } from 'react';
import { Box, Columns, Button, Table, Content } from 'react-bulma-components';
import { useUser } from './UserContext';




function DocumentViewer({htmlFileContent}) {
    console.log(htmlFileContent)
    return ( 
        <Content>
        <div
        className="file-changes-content"
        dangerouslySetInnerHTML={{ __html: htmlFileContent }} />
        </Content>
     );
}

export default DocumentViewer;