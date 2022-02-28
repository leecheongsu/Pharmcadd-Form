import { forwardRef } from "react";
import Link from 'next/link'
import classNames from "classnames";
import PropTypes from "prop-types";

const propTypes = {
    icon: PropTypes.bool,
    link: PropTypes.bool,
    outline: PropTypes.bool,
    block: PropTypes.bool,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    href: PropTypes.string.isRequired,
};

const LinkButton = forwardRef((
    {
        icon = false,
        link = false,
        outline = false,
        block = false,
        active = false,
        disabled = false,
        className,
        children,
        ...props
    },
    ref,
) => {
    return <Link {...props}>
        <a
            {...{ children }}
            ref={ref}
            className={classNames(
                icon && 'btn_icon',
                link && 'btn_link',
                outline && 'btn_outline',
                block && 'btn_block',
                active && 'active',
                disabled && 'disabled',
                className,
            )}
        />
    </Link>;

})

LinkButton.displayName = 'Link';
LinkButton.propTypes = propTypes;

export default LinkButton;
