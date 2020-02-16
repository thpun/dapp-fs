import * as React from "react";
import * as bsw07 from "../bsw07";
import ipfsClient from "ipfs-http-client";
import {getFileRepoContract} from "../contractUtil";
import {JsonEditor} from "jsoneditor-react";
import 'jsoneditor-react/es/editor.min.css';
import * as ethers from "ethers";

export class UploadSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      policy: {
        gate: 0,
        children: [{
          gate: 1,
          children: [{
            attr: "icon"
          }, {
            attr: "ethereum"
          }]
        }, {
          attr: "0x53DDE4be7a977488E9E8e6C8654Cf9823CBaa088"
        }]
      }
    };

    this.test = this.test.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleJSONChange = this.handleJSONChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFileChange(event) {
    this.setState({
      file: event.target.files[0]
    });
  }

  handleJSONChange(obj) {
    this.setState({
      policy: obj
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    console.log(value);

    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    let str = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(this.state.file);
      reader.onload = () => resolve(reader.result)
    });
    let data = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
    console.log(this.state.policy);
    let ciphertext = await bsw07.encrypt(this.props.url, data, JSON.stringify(this.state.policy),
      localStorage.getItem(`${this.props.wallet.address}-public`));
    let client = ipfsClient(this.props.ipfs);
    let result;
    for await (const res of client.add(ciphertext)) {
      console.log(res);
      result = res;
    }

    let contract = getFileRepoContract(this.props.wallet);
    let tx = await contract.registerFile(this.state.file.name, result.cid.string);
    await tx.wait();
    console.log(tx.hash);
    console.log("ok");
  }

  async test() {
    console.log(this.state.policy);
    /*console.log(Buffer.from(await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(this.state.file);
      reader.onload = () => resolve(reader.result)
    })).toString("hex"));*/
  }

  render() {
    return (
      <section className={"card"}>
        <div className={"card-header"} id={"uploadHeading"}>
          <h2 className={"mb-0"}>
            <button className={"btn collapsed"} type={"button"} data-toggle={"collapse"}
                    data-target={"#uploadCard"} aria-expanded={false} aria-controls={"uploadCard"}>
              1. Upload File
            </button>
          </h2>
        </div>
        <div id={"uploadCard"} className={"collapse"} aria-labelledby={"uploadHeading"} data-parent={"#accordionDiv"}>
          <div className={"card-body"}>
            <form onSubmit={this.handleSubmit}>
              <div className={"form-group"}>
                <label htmlFor={"formControlFile"}>File to upload</label>
                <input type={"file"} className={"form-control-file"} id={"formControlFile"} name={"file"}
                  onChange={this.handleFileChange}/>
              </div>
              <div className={"form-group"}>
                <label>Attribute Access Structure</label>
                <JsonEditor name={"policy"} value={this.state.policy}
                            onChange={this.handleJSONChange} />
              </div>
              <button type={"submit"} className={"btn btn-primary"}>
                Upload
              </button>
            </form>
            <button type={"button"} className={"btn btn-primary"} onClick={this.test}>test</button>
          </div>
        </div>
      </section>
    )
  }
}
