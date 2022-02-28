import React, {useEffect, useState} from "react";
import {CloseIcon, InfoIcon, SuccessIcon, WarningIcon} from "../../assets/icon/icon";
import PropTypes from "prop-types";
import classNames from "classnames";


const propTypes = {
    state: PropTypes.bool,
    toastOnChange: PropTypes.func,
    toastConf:
        PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string,
            autoClose: PropTypes.bool,
            blindFilter: PropTypes.bool,
    }),
    as: PropTypes.elementType
}
const ToastBox = ({
                      state = false,
                      toastOnChange,
                      toastConf: configs = [],
                      as: Component = 'div'
                  }) => {

    useEffect(() => {
        setTimeout(() => {
            if (configs.autoClose) {
                toastOnChange(false)
            }
        }, 2500)
    }, [state])

    const Icon = () => {
        return configs.type === 'success' ? <SuccessIcon/> :
            configs.type === 'warning' ? <WarningIcon/> :
                <InfoIcon/>
    }

    const handleChange = (e) => {
        e.preventDefault()
        toastOnChange(false)
    }

    const classes = "toast flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"

    return (
        <div>
            { state && (
                <div>
                    {configs.blindFilter && (
                        <div className="toast-wrap"/>
                    )}
                    <Component
                        className={classNames(
                            classes,
                            configs.autoClose ? 'fade-down-without-close' : 'fade-down-with-close',
                        )}
                        role="alert">
                        <Icon/>
                        <div
                            className="ml-3 text-sm font-normal">{configs.message}</div>
                        {
                            !configs.autoClose && <CloseIcon onChange={handleChange}/>
                        }
                    </Component>
                </div>
            )}
        </div>
    )
};

ToastBox.displayName = 'ToastBox';
ToastBox.propTypes = propTypes;

export default ToastBox;