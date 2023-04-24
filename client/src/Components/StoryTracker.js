import React, { useEffect, useState, useRef } from 'react';
import { Box, Columns, Button, Table, Content, Tabs } from 'react-bulma-components';
import { useUser } from './UserContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  fa
} from "@fortawesome/free-solid-svg-icons";
import FilePickerBox from './FilePickerBox';
import { json } from 'react-router';
import TrackedChangesBox from './TrackedChangesBox';
import DocumentViewer from './DocumentViewer';

function StoryTracker() {

const [userPath, setUserPath] = useState('');
const [userFiles, setUserFiles] = useState([]);
const [fileDiff, setFileDiff] = useState('');
const [htmlFileContent, setHtmlFileContent] = useState('')
const [showFileDiff, setShowFileDiff] = useState(true);
const [showFilePicker, setShowFilePicker] = useState(true);
const [selectedFile, setSelectedFile] = useState('');
const [activeTab, setActiveTab] = useState('DocumentViewer');
const { user } = useUser();

useEffect(() => {
  if (user && user.username) {
    getFiles(user.username);
  }
}, [user]);

useEffect(() => {
  if (user && user.username && selectedFile) {
    getDiff(user.username, selectedFile);
  }
}, [user, selectedFile]);

useEffect(() => {
  if (user && user.username && selectedFile) {
    getDocument(user.username, selectedFile);
  }
}, [user, selectedFile]);

async function getDocument(userName, file) {
  const response = await fetch(`http://localhost:3001/getHtmlDoc?username=${userName}&fileName=${file}`);
  const docData = await response.json();
  console.log(docData);
  setHtmlFileContent(docData);
}

  
  
  async function getFiles(userName) {
    const response = await fetch(`http://localhost:3001/getFiles?username=${userName}`);
    const data = await response.json();
    console.log(data);
    setUserFiles(data);

  }
  
  async function getDiff(userName, file) {
    const response = await fetch(`http://localhost:3001/getDiff?username=${userName}&fileName=${file}`);
  
    if (response.status === 404) {
      setFileDiff("No recent tracked changes");
    } else {
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
  }
  
  function tabPicker(tab) {
    setActiveTab(tab);
  }


    return ( 
        <Columns>
            <Columns.Column size={4} className='px-0'>
                <Box className='tool-box file-ui-box px-1'>
                <FilePickerBox userFiles={userFiles} getDiff={getDiff} user={user} setSelectedFile={setSelectedFile} selectedFile={selectedFile} />
                </Box>
                </Columns.Column>
                <Columns.Column size={8} className="px-1">
                <Box className="file-changes-box file-ui-box">
                <Tabs>
                <Tabs.Tab active={activeTab === 'TrackedChanges'} onClick={() => tabPicker('TrackedChanges')}>Tracked Changes</Tabs.Tab>
                <Tabs.Tab active={activeTab === 'DocumentViewer'} onClick={() => tabPicker('DocumentViewer')}>Document</Tabs.Tab>
                </Tabs>
                {activeTab === 'TrackedChanges' && <TrackedChangesBox user={user} getDiff={getDiff} selectedFile={selectedFile} fileDiff={fileDiff} />}
                {activeTab === 'DocumentViewer' && <DocumentViewer user={user} htmlFileContent={htmlFileContent} getDocument={getDocument} />}
                </Box>
                
                </Columns.Column>
              </Columns>

     );


}

export default StoryTracker;