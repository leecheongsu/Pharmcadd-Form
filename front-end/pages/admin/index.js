const Admin = () => {
    return <></>
}

export const getServerSideProps = async () => {
    return {
        redirect: {
            destination: '/admin/forms',
            permanent: true,
        },
    }
}

export default Admin;
