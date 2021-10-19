import * as React from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

interface Props {
    name: string
    description: string
    value: string
    onBlur: Function
    onOpen: Function
    options: [string]
}

export class TextFieldWithDescription extends React.Component<Props> {
    cacheName: string;

    constructor(props: Props) {
        super(props);
        this.cacheName = this.props.name + "Cache"

        this.handleBlur = this.handleBlur.bind(this);
    }

    handleBlur(event){
        this.props.onBlur(this.cacheName, event.target.value);
    }

    render() {
        return (
        <Grid container spacing={2} padding={1}>
            <Grid item xs={4}>
                <Autocomplete fullWidth
                    freeSolo
                    id={this.props.name + "-selector"}
                    onBlur={this.handleBlur}
                    onOpen={() => {this.props.onOpen(this.cacheName)}}
                    options={this.props.options}
                    value={this.props.value}
                    renderInput={(params) =><TextField
                        {...params}
                        label={this.props.name}
                        size="small"
                        InputLabelProps={{...params.InputProps, shrink: true}}
                        />
                    }
                />
            </Grid>
            <Grid item xs={8}><label>{this.props.description}</label></Grid>
        </Grid>
        );
    }
}