import * as React from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

interface Props {
    name: string
    description: string
    value: string
    onBlur: Function
    onChange: Function
    onOpen: Function
    options: [string]
}

export class TextFieldWithDescription extends React.Component<Props> {
    cacheName: string;

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.cacheName = this.props.name + "Cache"
    }

    handleChange(event){
        this.props.onChange(event.target.value, this.props.name);
    }

    render() {
        return (
        <Grid container spacing={2} padding={1}>
            <Grid item xs={4}>
                <Autocomplete fullWidth
                    freeSolo
                    id={this.props.name + "-selector"}
                    onBlur={() => {this.props.onBlur(this.cacheName, this.props.value)}}
                    onOpen={() => {this.props.onOpen(this.cacheName)}}
                    options={this.props.options}
                    renderInput={(params) =><TextField
                        {...params}
                        label={this.props.name}
                        onChange={this.handleChange}
                        size="small"
                        InputLabelProps={{...params.InputProps, shrink: true}}
                        value={this.props.value}
                        />
                    }
                />
            </Grid>
            <Grid item xs={8}><label>{this.props.description}</label></Grid>
        </Grid>
        );
    }
}