import React from 'react';
import Select from 'react-select';

const options = [
    { value: 'null', label: 'Select Summary Type' },
    { value: '0', label: '[0 level] - Just Merge' },
    { value: '1', label: '[1 level]' },
    { value: '2', label: '[2 level]' },
];

function SelectType(props) {
    const handleChange = (e) => {
        props.selectType.current = e.value;
        console.log(e);
        console.log(props.selectType);
    };

    return (
        <div>
            <Select
                onChange={handleChange}
                defaultValue={options[0]}
                options={options}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        primary: '#2856A0',
                    },
                })}
            />
        </div>
    );
}

export default SelectType;