import classNames from "classnames";

const Card = (
    {
        className,
        as: Component = 'div',
        ...props
    }) => {

    return (
        <Component
            {...props}
            className={classNames(
                'card',
                className,
            )}
        />
    )
}

export default Card;
