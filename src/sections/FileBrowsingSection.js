import * as React from "react";
import * as bsw07 from "../bsw07";
import {getFileRepoContract} from "../contractUtil";
import ipfsClient from "ipfs-http-client";
import {ethers} from "ethers";

const getFile = async (ipfs, cid) => {
  let chunks = [];
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
};

export class FileBrowsingSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      key: "",
      result: null
    };

    this.handleFileDownload = this.handleFileDownload.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFileDownload(index) {
    return async (event) => {
      event.preventDefault();
      try {
        let fileID = this.state.result[index].id;

        let ipfs = ipfsClient(this.props.ipfs);
        let ciphertext = (await getFile(ipfs, fileID)).toString();
        console.log(ciphertext);
        let data = await bsw07.decrypt(this.props.url, ciphertext, this.state.key);
        console.log(data);
        let str = ethers.utils.toUtf8String(data);
        let win = window.open();
        win.document.write(`<iframe src="${str}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen />`)
      } catch (e) {
        console.error(e);
      }
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    let contract = getFileRepoContract(this.props.wallet);
    let result = await contract.list(this.state.address);
    console.log(result);
    this.setState({
      result: result
    });
  }

  render() {
    return (
      <section className={"card"}>
        <div className={"card-header"} id={"fileBrowsingHeading"}>
          <h2 className={"mb-0"}>
            <button className={"btn"} type={"button"} data-toggle={"collapse"} data-target={"#fileBrowsingCard"}
                    aria-expanded={false} aria-controls={"fileBrowsingCard"}>
              3. Browse File Repository
            </button>
          </h2>
        </div>
        <div id={"fileBrowsingCard"} className={"collapse"} aria-labelledby={"fileBrowsingHeading"}
             data-parent={"#accordionDiv"}>
          <div className={"card-body"}>
            <form onSubmit={this.handleSubmit}>
              <div className={"form-group"}>
                <label htmlFor={"fileOwner"}>Address of file owner</label>
                <input type={"text"} className={"form-control"} id={"fileOwner"} name={"address"}
                       value={this.state.address} onChange={this.handleInputChange} />
              </div>
              <button type={"submit"} className={"btn btn-primary"}>
                Browse
              </button>
            </form>
            <br />
            {this.state.result ?
              <span>
                <form>
                  <div className={"form-group"}>
                    <label htmlFor={"activeDecryptKey"}>Decryption key</label>
                    <input type={"text"} className={"form-control"} id={"activeDecryptKey"} name={"key"}
                           value={this.state.key} onChange={this.handleInputChange} />
                  </div>
                </form>
                <div className={"list-group"}>
                  {this.state.result.map((file, index) => (
                    <button type={"button"} className={"list-group-item list-group-item-action"} key={index.toString()}
                      onClick={this.handleFileDownload(index)}>
                      {file.name}
                    </button>
                  ))}
                </div>
              </span> : ""}
          </div>
        </div>
      </section>
    )
  }
}
