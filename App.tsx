// import 'node-libs-react-native/globals';
const snarkjs = require('snarkjs')
// const snarkjs = require('./snarkjs.min.js')

import React, { useState } from 'react';
import styled from 'styled-components/native'
import { Button } from 'react-native';

// import { StatusBar } from 'expo-status-bar';

const StyledView = styled.View`
flex: 1;
background-color: white;
justify-content: center;
align-items: center;
`
const StyledText = styled.Text`
font-size: 20px;
  color: black;
`
const StyledInput = styled.TextInput`
  margin: 12px;
  border: 2px solid black;
  border-radius: 4px;
  padding: 10px;
  color: black;
`

export default function App() {
  const [x, setX] = useState('1')
  const [y, setY] = useState('2')
  const [res, setRes] = useState('None')

  async function loadFile(filePath: string) {
    const response = await fetch(filePath);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }

  async function calculateProof() {
    try {
      const wasmFile = await loadFile('./assets/addition.wasm');
      const zkeyFile = await loadFile('./assets/addition_plonk.zkey')

      

      const { proof, publicSignals } = await snarkjs.plonk.fullProve(
        { "x": x, "y": y },
        wasmFile,
        zkeyFile
      );

      const vkey = await fetch("./assets/addition.plonk.vkey.json").then((res) => res.json());

      const res2 = await snarkjs.plonk.verify(vkey, publicSignals, proof);
      setRes(res2 ? 'Proof is valid' : 'Proof is invalid');

    } catch (error) {
      console.error("Error during proof calculation:", error);
      setRes("Error calculating proof");
    }
  };

  return (
    <StyledView>

      <StyledText>Addition</StyledText>
      <StyledText id='bebra'>res: {res}</StyledText> 
      <StyledText id='bebra'>x: {x}</StyledText> 
      <StyledText id='bebra'>y: {y}</StyledText> 

      <StyledInput placeholder="x" onChangeText={(text) => setX(text)}/>
      <StyledInput placeholder="y" onChangeText={(text) => setY(text)}/>
      <StyledInput editable={false} selectTextOnFocus={false} value='80'/>

      <Button title="submit" 
        onPress={()=>calculateProof()}
      ></Button>
      {/* <StatusBar style="auto" /> */}
    </StyledView>
  );
}
