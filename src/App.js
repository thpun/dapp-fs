import React from 'react';
import './App.css';
import {EthKeyGenSection} from "./sections/EthKeyGenSection";
import * as ethers from "ethers";
import * as bsw07 from "./bsw07";
import {UploadSection} from "./sections/UploadSection";
import {GenKeySection} from "./sections/GenKeySection";
import {FileBrowsingSection} from "./sections/FileBrowsingSection";
import ipfsClient from "ipfs-http-client";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: "",
      ipfs: "",
      privateKey: "",
      rpc: "",
      url: "",
      wallet: null
    };

    this.handleApply = this.handleApply.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async handleApply(event) {
    event.preventDefault();

    let url = `http://${this.state.rpc}`;
    let provider = new ethers.providers.JsonRpcProvider(url, "rinkeby");
    let wallet = new ethers.Wallet(this.state.privateKey, provider);

    let balance = ethers.utils.formatEther(await wallet.provider.getBalance(wallet.address));
    if (!localStorage.getItem(`${wallet.address}-master`)) {
      let obj = await bsw07.setup(url);
      console.log(obj);
      localStorage.setItem(`${wallet.address}-master`, obj.msk);
      localStorage.setItem(`${wallet.address}-public`, obj.pk);
    }

    let client = ipfsClient(this.state.ipfs);
    console.log(await client.bootstrap.list());

    this.setState({
      balance: balance,
      url: url,
      wallet: wallet
    })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="App container">
        <section className={"card"}>
          <div className={"card-body"}>
            <h5 className={"card-title"}>Global setting</h5>
            <form onSubmit={this.handleApply}>
              <div className={"form-group"}>
                <label htmlFor={"ipfs"}>IPFS API multiaddr</label>
                <input type={"text"} className={"form-control"} name={"ipfs"} id={"ipfs"}
                       value={this.state.ipfs} onChange={this.handleInputChange} required={true} />
              </div>
              <div className={"form-group"}>
                <label htmlFor={"rpc"}>RPC Host</label>
                <input type={"text"} className={"form-control"} name={"rpc"} id={"rpc"}
                       value={this.state.rpc} onChange={this.handleInputChange} required={true} />
              </div>
              <div className={"form-group"}>
                <label htmlFor={"privateKey"}>Private Key</label>
                <input type={"text"} className={"form-control"} name={"privateKey"} id={"privateKey"}
                       value={this.state.privateKey} onChange={this.handleInputChange} required={true} />
              </div>
              <button type={"submit"} className={"btn btn-primary"}>Apply</button>
              {
                this.state.wallet ?
                  <span>
                    <div className={"form-group"}>
                      <br />
                      <label htmlFor={"address"}>Address</label>
                      <input type={"text"} className={"form-control"} id={"address"} readOnly={true}
                             value={this.state.wallet.address} />
                    </div>
                    <p>Balance: {this.state.balance} ethers</p>
                    <p>Get ethers:</p>
                    <div className={"btn-group"} role={"group"}>
                      <a href={"https://testnet.help/en/ethfaucet/rinkeby"} target={"_blank"} className={"btn btn-primary"}
                           rel={"noreferrer noopener"} tabIndex={-1} role={"button"}>0.2 / day</a>
                      <a href={"http://rinkeby-faucet.com/"} target={"_blank"} className={"btn btn-primary"}
                           rel={"noreferrer noopener"} tabIndex={-1} role={"button"}>0.001 / day</a>
                    </div>
                  </span> : ""
              }
            </form>
          </div>
        </section>
        <div className={"accordion"} id={"accordionDiv"}>
          <EthKeyGenSection />
          {this.state.wallet ? (
            <span>
              <UploadSection url={this.state.url} ipfs={this.state.ipfs} wallet={this.state.wallet}/>
              <GenKeySection url={this.state.url} wallet={this.state.wallet} />
              <FileBrowsingSection url={this.state.url} ipfs={this.state.ipfs} wallet={this.state.wallet} />
            </span>
          ): ""}
        </div>
      </div>
    );
  }
}

export default App;
