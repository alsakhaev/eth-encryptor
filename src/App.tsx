import React from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { encrypt } from "./encrypt";

interface P {}

interface S {
  input: string;
  output: string;
  publicKey: string;
}

export default class App extends React.Component<P, S> {
  constructor(p: P) {
    super(p);
    this.state = {
      input: "",
      output: "",
      publicKey: "",
    };
  }

  async encryptButtonClickHandler() {
    const data = this.state.input;
    const publicKey = this.state.publicKey;
    const encrypted = JSON.stringify(
      encrypt({ publicKey, data, version: "x25519-xsalsa20-poly1305" })
    );
    this.setState({ output: encrypted });
  }

  async decryptButtonClickHandler() {
    const encrypted = this.state.output;
    const ethereum: any = await detectEthereumProvider();
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const message = await ethereum.request({
      method: "eth_decrypt",
      params: [encrypted, accounts[0]],
    });
    this.setState({ input: message });
  }

  async publicKeyButtonClickHandler() {
    const ethereum: any = await detectEthereumProvider();
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const publicKey = await ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [accounts[0]],
    });
    this.setState({ publicKey });
  }

  publicKeyInputChangeHandler(e: any) {
    this.setState({ publicKey: e.target.value });
  }

  inputInputChangeHandler(e: any) {
    this.setState({ input: e.target.value });
    this.encryptButtonClickHandler();
  }

  outputInputChangeHandler(e: any) {
    this.setState({ output: e.target.value });
  }

  render() {
    const s = this.state;

    return (
      <>
        <a href="https://github.com/alsakhaev/eth-encryptor">
          <img
            loading="lazy"
            width="149"
            height="149"
            src="https://github.blog/wp-content/uploads/2008/12/forkme_right_gray_6d6d6d.png?resize=149%2C149"
            className="github-fork"
            alt="Fork me on GitHub"
            data-recalc-dims="1"
          />
        </a>

        <div className="container">
          <h1>eth-encryptor</h1>
          <p>Encrypt and decrypt text with MetaMask wallet in browser</p>

          <div>
            <label>Public Key</label>
            <br />
            <input
              value={s.publicKey}
              onChange={this.publicKeyInputChangeHandler.bind(this)}
            />
            <button onClick={this.publicKeyButtonClickHandler.bind(this)}>
              Request from MetaMask
            </button>
          </div>

          <div>
            <label>Decrypted Text</label>
            <br />
            <textarea
              value={s.input}
              onChange={this.inputInputChangeHandler.bind(this)}
            />
          </div>

          <button onClick={this.encryptButtonClickHandler.bind(this)}>
            Encrypt
          </button>

          <div>
            <label>Encrypted Text</label>
            <br />
            <textarea
              value={s.output}
              onChange={this.outputInputChangeHandler.bind(this)}
            />
          </div>

          <button onClick={this.decryptButtonClickHandler.bind(this)}>
            Decrypt
          </button>
        </div>
      </>
    );
  }
}
