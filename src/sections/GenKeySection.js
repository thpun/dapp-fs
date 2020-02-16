import * as React from "react";
import * as bsw07 from "../bsw07";

export class GenKeySection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: [],
      key: ""
    };

    this.handleAddAttribute = this.handleAddAttribute.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemoveAttribute = this.handleRemoveAttribute.bind(this);
  }

  handleAddAttribute() {
    this.setState({
      attributes: this.state.attributes.concat("")
    })
  };

  handleAttributeChange = index => event => {
    const newAttributes = this.state.attributes.map((attribute, attrIndex) => {
      if (index !== attrIndex) {
        return attribute
      } else {
        return event.target.value
      }
    });
    this.setState({
      attributes: newAttributes
    });
  };

  async handleSubmit(event) {
    event.preventDefault();
    let str = await bsw07.keygen(this.props.url, this.state.attributes,
      localStorage.getItem(`${this.props.wallet.address}-master`));
    console.log("key", str);
    this.setState({
      key: str
    });
  }

  handleRemoveAttribute = index => () => {
    this.setState({
      attributes: this.state.attributes.filter((attr, attrIndex) => index !== attrIndex)
    });
  };

  render() {
    return (
      <section className={"card"}>
        <div className={"card-header"} id={"genKeyHeading"}>
          <h2 className={"mb-0"}>
            <button className={"btn"} type={"button"} data-toggle={"collapse"} data-target={"#genKeyCard"}
                    aria-expanded={false} aria-controls={"genKeyCard"}>
              2. Generate private key for decryption
            </button>
          </h2>
        </div>
        <div id={"genKeyCard"} className={"collapse"} aria-labelledby={"genKeyHeading"}
             data-parent={"#accordionDiv"} >
          <div className={"card-body"}>
            <form onSubmit={this.handleSubmit}>
              <div className={"form-group"}>
                <label htmlFor={"entitledAttributes"}>
                  Attributes bound to the new private key
                </label>
                <div id={"entitledAttributes"}>
                  {this.state.attributes.map((attribute, index) => (
                    <div className={"attribute row"} key={index.toString()}>
                      <div className={"col-sm-11"}>
                        <input type={"text"} className={"form-control"} placeholder={"attribute"}
                                                          value={attribute}
                                                          onChange={this.handleAttributeChange(index)}/>
                      </div>
                      <div className={"col-sm-1"}>
                        <button  className={"btn btn-outline-secondary"} type={"button"} aria-label={"Delete"} onClick={this.handleRemoveAttribute(index)}>
                          <span aria-hidden={true}>&minus;</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button type={"button"} className={"btn btn-secondary"} onClick={this.handleAddAttribute}>
                Add Attribute
              </button>
              <button type={"submit"} className={"btn btn-primary"}>
                Generate
              </button>
              {this.state.key ? (
                <div className={"form-group"}>
                  <label htmlFor={"generatedDecryptKey"}>New private key bound with the above attributes</label>
                  <input type={"text"} className={"form-control"} id={"generatedDecryptKey"} readOnly={true}
                         value={this.state.key} />
                </div>
              ) : ""}
            </form>
          </div>
        </div>
      </section>
    )
  }
}
