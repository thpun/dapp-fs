import React from "react";
import * as ethers from "ethers";


export class EthKeyGenSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      privateKey: "",
      value: ""
    };
    this.generateKey = this.generateKey.bind(this);
  }

  generateKey() {
    let newKey = ethers.Wallet.createRandom();
    this.setState({
      address: newKey.address,
      privateKey: newKey.privateKey
    })
  }

  render() {
    return (
      <section className={"card"}>
        <div className={"card-header"} id={"ethGenKeyHeading"}>
          <h2 className={"mb-0"}>
            <button className={"btn"} type={"button"} data-toggle={"collapse"} data-target={"#ethGenKeyCard"}
                    aria-expanded={false} aria-controls={"ethGenKeyCard"}>
              0. Generate new Ethereum Key if needed
            </button>
          </h2>
        </div>
        <div id={"ethGenKeyCard"} className={"collapse"} aria-labelledby={"ethGenKeyHeading"}
             data-parent={"#accordionDiv"}>
          <div className={"card-body"}>
            <p>
              <button type={"button"} className={"btn btn-primary"} onClick={this.generateKey}>
                Generate new key for me
              </button>
            </p>
            <form>
              <div className={"form-group"}>
                <label htmlFor={"staticPrivateKey"}>Private Key</label>
                <input type={"text"} className={"form-control"} id={"staticPrivateKey"} readOnly={true}
                       value={this.state.privateKey ? this.state.privateKey : ""}/>
              </div>
              <div className={"form-group"}>
                <label htmlFor={"staticAddress"}>Address</label>
                <input type={"text"} className={"form-control"} id={"staticAddress"} readOnly={true}
                       value={this.state.address ? this.state.address : ""}/>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }
}
