import { forwardRef, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import FormContext from './FormContext';
import getUid from "../utils/uid";

const propTypes = {
    id: PropTypes.string,
    as: PropTypes.elementType,
};

const FormGroup = forwardRef((
        {
            id,
            as: Component = 'div',
            ...props
        },
        ref,
    ) => {
        const [cid, setCid] = useState(id);
        const context = useMemo(() => ({ cid }), [cid]);
        useEffect(() => {
            if (!id) {
                const newId = getUid()
                setCid(newId)
            }
        }, [id])

        return (
            <FormContext.Provider value={context}>
                <Component {...props} ref={ref} />
            </FormContext.Provider>
        );
    },
);

FormGroup.displayName = 'FormGroup';
FormGroup.propTypes = propTypes;

export default FormGroup;
