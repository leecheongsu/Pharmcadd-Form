import React from "react";
import PropTypes from "prop-types";
import Button from "../Button";

const propTypes = {
    state: PropTypes.bool,
    className: PropTypes.string,
    modalConf: PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.string,
        blindFilter: PropTypes.bool,
        handleLeftButton: PropTypes.shape({
            title: PropTypes.string,
            onClick: PropTypes.func
        }),
        handleRightButton: PropTypes.shape({
            title: PropTypes.string,
            onClick: PropTypes.func
        }),
    }),
    as: PropTypes.elementType
}

const ModalBox = ({
                      state = false,
                      className,
                      child,
                      modalConf: configs = [],
                      as: Component = 'div'
                  }) => {

    let leftButton = configs.handleLeftButton
    let rightButton = configs.handleRightButton

    return (
        <div>
            {state && (
                <div>{configs.blindFilter && (
                    <div className="modal-wrap"/>
                )}
                    <Component className="alert text-center">
                        <p className="text-xl">
                            {configs.title}
                        </p>
                        <p className="mb-3">
                            {configs.content}
                        </p>
                        {child}
                        <div className="text-center">
                            {leftButton &&
                            <Button className="btn btn_outline btn_sm px-3"
                                    onClick={() => leftButton?.onClick()}>{leftButton?.title}</Button>
                            }
                            {rightButton &&
                            <Button className="btn btn_sm px-3"
                                    onClick={() => rightButton?.onClick()}>{rightButton?.title}</Button>

                            }
                        </div>
                    </Component>
                </div>
            )}
        </div>
    )
};

ModalBox.displayName = 'ModalBox';
ModalBox.propTypes = propTypes;

export default ModalBox;