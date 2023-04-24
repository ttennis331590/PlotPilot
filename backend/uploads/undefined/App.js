import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Columns,
  Modal,
  Image,
  Navbar,
  Level,
  Table,
  Card,
} from "react-bulma-components";
import "../assets/css/App.css";
import chokidar from "chokidar";
import diff from "diff";
import { createPatch } from "diff";
import fs from "fs";
import { useUser } from "./UserContext";
import Login from "./Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import logo from "../assets/images/plotpilot_logo.png";
import path from "path";
import { Buffer } from "buffer";
import { Diff } from "diff";


function App() {
  const [currentWatchList, setCurrentWatchList] = useState([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [fileDiff, setFileDiff] = useState("");
  const [changedFiles, setChangedFiles] = useState([]);
  const { handleLogout } = useUser();

  const watcher = chokidar.watch(currentWatchList, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });




  const handleWatcherEvent = async (event, path) => {
    if (!changedFiles.includes(event)) {
      setChangedFiles(changedFiles.concat(event));
    }
    console.log(changedFiles);
  };

  watcher.on("change", handleWatcherEvent);
  watcher.on("ready", () =>
    console.log("Initial scan complete. Ready for changes")
  );

  const handleNewFile = (event) => {
    const file = event.target.files[0];
    if (file && (!currentWatchList.includes(file.path))) {
      setCurrentWatchList(currentWatchList.concat(file.path));
    }
  };

  async function uploadChangedFiles() {
    const formData = new FormData();

    // Add username to the formData
    formData.append("username", user.username);

    // Read the files and append them to formData
    changedFiles.forEach((filePath) => {
      const file = fs.readFileSync(filePath);
      const fileName = path.basename(filePath);
      formData.append("files", new Blob([file]), fileName);
    });

    // Send the formData to the endpoint
    try {
      const response = await fetch("http://localhost:3001/appSync", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        console.log("Files uploaded successfully");
        // Clear the changedFiles array after a successful upload
        setChangedFiles([]);
      } else {
        console.error("Error uploading files:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }


  const handleNewFolder = (event) => {
    const folder = event.target.files;
    if (folder.length > 0) {
      const firstFile = folder[0];
      console.log("firstFile", firstFile);
      const folderPath = firstFile.webkitRelativePath.split("/");
      const pathArray = firstFile.path.split("\\").slice(0);

      for (let i = pathArray.length - 1; i >= 0; i--) {
        if (pathArray[i] === folderPath[0]) {
          break;
        } else {
          pathArray.pop();
        }
      }
      const path = pathArray.join("\\");
      setCurrentWatchList(currentWatchList.concat(path));

      console.log("Folder Added:" + path);
    }
  };

  function getWatchedPaths() {
    console.log(currentWatchList);
  }

  function clearChangedFiles() {
    setChangedFiles([]);
  }

  const { user, setUser } = useUser();

  const onLogoutClick = () => {
    handleLogout();
  };

  if (!user) {
    return <Login />;
  }

  function checkForDuplicates(path) {
    if (currentWatchList.includes(path)) {
      return true;
    } else {
      return false;
    }
  }


  return (
    <Columns className="is-centered py-0">
      <Columns.Column className="is-6 is-centered has-text-centered py-0">
      <Image src={logo} alt="PlotPilot Logo" className="px-6"/>
      </Columns.Column>
      <Columns.Column className="is-full is-centered">
        <Card className="mx-3 watched-modified-path-card">
          <Card.Header>
            <Card.Header.Title>Watched Paths</Card.Header.Title>
            <label className="file-label">
            <input
              className="file-input"
              type="file"
              onChange={handleNewFolder}
              webkitdirectory="true"
              directory="true"
              mozdirectory="true"
            />
            <span className="file-cta button-span-no-outline">
              <span className="file-label">
                <FontAwesomeIcon icon={solid("folder-plus")} size="lg" />
              </span>
            </span>
          </label>
          <label className="file-label">
          <input
            className="file-input"
            type="file"
            onChange={handleNewFile}
          />
          <span className="file-cta">
            <span className="file-label">
              <FontAwesomeIcon icon={solid("file-circle-plus")} size="lg" />
            </span>
          </span>
        </label>
          </Card.Header>
          <Card.Content className="scrollbar">
          <Table className="fullWidth">
          {currentWatchList.map((path, index) => {
            return (
              <tr>
                <td
                  key={index}
                  className="list-path path-scroll"
                  onClick={(e) => {
                    const content = e.currentTarget.querySelector(".path-content");
                    content.style.transform = "translateX(-70%)";
                  }}
                  onMouseLeave={(e) => {
                    const content = e.currentTarget.querySelector(".path-content");
                    content.style.transform = "translateX(0)";
                  }}
                >
                  <div className="path-content">{path}</div>
                </td>
                <td>
                  <FontAwesomeIcon icon={solid("folder-minus")} size="lg" />
                </td>
              </tr>
            );
          })}
          </Table>

          </Card.Content>
        </Card>
      </Columns.Column>
      <Columns.Column className="is-full is-centered py-0">
        <Card className="m-3 watched-modified-path-card">
          <Card.Header>
            <Card.Header.Title>Modified Files</Card.Header.Title>
            <div className="p-3" onClick={clearChangedFiles}>
            <FontAwesomeIcon icon={solid("trash-alt")} size="lg" />
            </div>
          </Card.Header>
          <Card.Content className="scrollbar">
            {changedFiles.map((path, index) => {
              return <p key={index}>{path}</p>;
            })}



          </Card.Content>
        </Card>
        <Button fullwidth={true} onClick={uploadChangedFiles}>Test</Button>
      </Columns.Column>

    </Columns>
  );
}

export default App;
