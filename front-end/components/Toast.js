import React from 'react'

export default function Toast({ message = 'message' }) {
    return (
        <div className="toastbox show">
            <div className="toast">
                <p>{message}</p>
            </div>
        </div>
    )
}
