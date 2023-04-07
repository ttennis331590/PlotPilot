import React, { useEffect, useState } from 'react';
import { Box, Content } from 'react-bulma-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'


function Prompt () {
    const [prompt, setPrompt] = useState('');
    const [promptIndex, setPromptIndex] = useState(0);
    const [writingPrompts, setWritingPrompts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/currentPrompts')
        .then(response => response.json())
        .then(data => {
            setWritingPrompts(data);
        })
    }, []);


    function nextPrompt() {
        if (promptIndex < writingPrompts.length - 1)
            setPromptIndex(promptIndex + 1);
        else setPromptIndex(0);
    }
    function prevPrompt() {
        if (promptIndex > 0)
            setPromptIndex(promptIndex - 1);
        else setPromptIndex(writingPrompts.length - 1);
    }

    useEffect(() => {
        console.log(promptIndex)
    }, [promptIndex]);

    useEffect(() => {
            getRandomPrompt();
        }, []);

    const getRandomPrompt = () => {
        const randomPrompt = writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
        console.log(randomPrompt);
        setPrompt(randomPrompt);
    };

    
    return ( 
        <>
    <Box>
        <Content>
        <p className='is-size-4'>{writingPrompts.length > 0 && writingPrompts[promptIndex].content}</p>
        </Content>
     
    </Box>
    <div className='is-flex is-justify-content-center mb-2'>
        <FontAwesomeIcon icon={faAngleLeft} size='2x' onClick={prevPrompt} className='has-text-white' />
        <p className='has-text-white is-size-5'>{promptIndex + 1}/{writingPrompts.length}</p>
        <FontAwesomeIcon icon={faAngleRight} size='2x' onClick={nextPrompt} className='has-text-white'/>
    </div>
    </>
     );
}

export default Prompt ;