import React, { useEffect, useState, useRef } from 'react';
import { Box, Columns, Button, Table, Content } from 'react-bulma-components';
import { useUser } from './UserContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  fa
} from "@fortawesome/free-solid-svg-icons";
import FilePickerBox from './FilePickerBox';
import { json } from 'react-router';
import TrackedChangesBox from './TrackedChangesBox';

function StoryTracker() {

const [userPath, setUserPath] = useState('');
const [userFiles, setUserFiles] = useState([]);
const [fileDiff, setFileDiff] = useState('');
const { user } = useUser();

useEffect(() => {
  if (user && user.username) {
    console.log(user.username);
    getFiles(user.username);
  }
}, [user]);


  
  
  async function getFiles(userName) {
    const response = await fetch(`http://localhost:3001/getFiles?username=${userName}`);
    const data = await response.json();
    console.log(data);
    setUserFiles(data);

  }
  
  async function getDiff(userName, file) {
    const response = await fetch(`http://localhost:3001/getDiff?username=${userName}&fileName=${file}`);
    const diffData = await response.json();
  
    // Convert the diff JSON data into a human-readable format using the diff library
    const formattedDiff = diffData
      .map((entry) => {
        if (entry.added) {
          return `<ins style={"background-color:#e6ffe6;"}>${entry.value}</ins>`;
        } else if (entry.removed) {
          return `<del style="background-color:#ffe6e6;">${entry.value}</del>`;
        } else {
          return entry.value;
        }
      })
      .join('');
  
    setFileDiff(formattedDiff);
  }
  



    return ( 
        <Columns>
            <Columns.Column size={4} className='px-0'>
                <Box className='tool-box file-ui-box px-1'>
                <FilePickerBox userFiles={userFiles} getDiff={getDiff} user={user} />
                </Box>
                </Columns.Column>
                <Columns.Column size={8} className="px-1">
                <TrackedChangesBox fileDiff={fileDiff} />
                </Columns.Column>
              </Columns>

     );


}

export default StoryTracker;