import React, { Component } from "react";
import sha256 from "crypto-js/sha256";
import classnames from "classnames";
import { Button } from "@blueprintjs/core";
import Key from "./Key";

export default class NewBlockHeader extends Component {
  changeNonce = evt => {
    this.props.block.setNonce(evt.target.value);
    this.props.rerender();
  };
  tryUntilFound = () => {
    if (!this.props.block.isValid()) {
      this.props.block.setNonce(
        sha256(new Date().getTime().toString()).toString()
      );
      this.props.rerender();

      if (!this.props.block.isValid()) {
        setTimeout(this.tryUntilFound, 20);
      }
    }
  };
  render() {
    return (
      <div>
        <p>
          This is the "mining" part of blockchains. In order to be allowed to
          add a block to the chain, is has to conform to certain criteria. To
          achieve consensus over the history of blocks, we have to make it
          difficult to do so, and in proof-of-work systems, that is ensured by
          having miners solve computational puzzles. In this case, we expect the
          hashes of of the blocks to end in a certain number of '0's by trying
          out many nonces. Other nodes can easily verify the integrity of the
          block by recalculating the hash.
        </p>
        <table className="pt-table .modifier">
          <tbody>
            <tr>
              <td />
              <td>SHA256(</td>
            </tr>
            <tr>
              <td>Parent Hash</td>
              <td>
                <textarea
                  className="pt-input"
                  spellCheck={false}
                  style={{ width: "200px", height: "100px" }}
                  value={this.props.block.parentHash}
                  readOnly
                />
              </td>
              <td>This value refers to the parent and is thus static.</td>
            </tr>
            <tr>
              <td />
              <td>+</td>
            </tr>
            <tr>
              <td>Coinbase Beneficiary</td>
              <td>
                <Key value={this.props.block.coinbaseBeneficiary} />
              </td>
              <td>This is the public key of your node</td>
            </tr>
            <tr>
              <td />
              <td>+</td>
            </tr>
            <tr>
              <td>Combined Transactions Hash </td>
              <td>
                <textarea
                  className="pt-input"
                  spellCheck={false}
                  style={{ width: "200px", height: "100px" }}
                  value={this.props.block.combinedTransactionsHash()}
                  readOnly
                />
              </td>
              <td>
                This is the combined hash for all transactions in the block that
                is computed via SHA256(txHash1 + txHash2 + ...)
              </td>
            </tr>
            <tr>
              <td />
              <td>+</td>
            </tr>
            <tr>
              <td>Nonce</td>
              <td>
                <textarea
                  className="pt-input"
                  spellCheck={false}
                  style={{ width: "200px", height: "100px" }}
                  value={this.props.block.nonce}
                  onChange={this.changeNonce}
                />
              </td>
              <td>
                This is the part that is miners have to guess random values for
                so that the hash becomes valid. Manually try to change the nonce
                or <Button onClick={this.tryUntilFound}>brute-force</Button>
              </td>
            </tr>
            <tr>
              <td />
              <td>) =</td>
            </tr>
            <tr>
              <td>Hash</td>
              <td>
                <textarea
                  className={classnames("pt-input", {
                    "pt-intent-danger": !this.props.block.isValid(),
                    "pt-intent-primary": this.props.block.isValid()
                  })}
                  spellCheck={false}
                  style={{ width: "200px", height: "100px" }}
                  value={this.props.block.hash}
                  readOnly
                />
              </td>
              <td>
                {this.props.block.isValid() &&
                  "The hash is valid as the last {BLOCK_DIFFICULTY = 2} characters are '0'. "}
                {!this.props.block.isValid() &&
                  "The hash is invalid as the last {BLOCK_DIFFICULTY = 2} characters are not '0'. "}
                In real blockchains, this difficulty is dynamic based upon how
                many blocks were mined in the recent past
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
