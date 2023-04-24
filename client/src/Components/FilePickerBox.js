import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Box, Columns, Button, Table, Content } from 'react-bulma-components';


function FilePickerBox({ user, userFiles, setSelectedFile, selectedFile}) {
   
function selectFile(file){
    setSelectedFile(file);
    console.log(selectedFile)
}

  return (
    <Box className="file-ui-box-header">
      <p className="file-ui-box-header-text">Files</p>
      <Table className="table-files">
        {userFiles.map((file) => (
          <tr>
            <td className="file-column-name is-vcentered">
              <p
                className="truncate scroll-on-hover"
                onClick={() => selectFile(file)}
              >
                {file}
              </p>
            </td>
            <td className="file-column-icon">
              <Button>
                <FontAwesomeIcon icon={faPaperPlane} />
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </Box>
  );
}

export default FilePickerBox;
