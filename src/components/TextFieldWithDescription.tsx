import * as React from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

interface Props {
    name: string
    description: string
    value: string
    onChange: Function
}

export class TextFieldWithDescription extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.props.onChange(event.target.value, this.props.name);
    }

    render() {
        return (
        <Grid container spacing={2} padding={1}>
            <Grid item xs={4}>
                <TextField
                id={this.props.name + "-textfield"}
                label={this.props.name}
                onChange={this.handleChange}
                size="small"
                value={this.props.value}
                />
            </Grid>
            <Grid item xs={8}><label>{this.props.description}</label></Grid>
        </Grid>
        );
    }
}