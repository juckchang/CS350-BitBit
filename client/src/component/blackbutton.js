function BlackButton(props) {
    return (
        <button className='b-createPDF'>
            <div className='b-inner-createPDF'><i>{props.name}</i></div>
            {props.icon}
        </button>
    );
}

export default BlackButton;