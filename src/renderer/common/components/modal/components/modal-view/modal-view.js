import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ModalEditUiPort from "../../containers/modal-edit-ui-port";
import ModalWarpSync from "../../containers/modal-warp-sync";
import ModalEditConnection from "../../containers/modal-edit-connection";
import * as TYPES from "../../constants/modal-types";
import Styles from "./modal-view.styles.less";

export default class ModalView extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      modalWidth: 0,
      modalHeight: 0
    };

    this.closeModal = this.closeModal.bind(this)
  }

  closeModal(e) {
    this.props.closeModal()
    e.stopPropagation()
  }

  render() {
    const { modal } = this.props;

    return (
      <section
        id="modal"
        ref={modal => {
          this.modal = modal;
        }}
        className={
          classNames(
            Styles.ModalView,
            {[Styles.ModalView__hide]: (Object.keys(modal).length === 0)}
          )
        }
      >
        { modal.type === TYPES.MODAL_EDIT_CONNECTION && <div onClick={this.closeModal} className={Styles.ModalView__close} /> }
        <div className={Styles.ModalView__content}>
          {modal.type === TYPES.MODAL_EDIT_CONNECTION && (
            <ModalEditConnection closeModal={this.closeModal} {...modal} />
          )}
          {modal.type === TYPES.MODAL_EDIT_UI_PORT && (
            <ModalEditUiPort closeModal={this.closeModal} {...modal} />
          )}
          {modal.type === TYPES.MODAL_WARP_SYNC && (
            <ModalWarpSync closeModal={this.closeModal} {...modal} />
          )}
        </div>
      </section>
    );
  }
}
