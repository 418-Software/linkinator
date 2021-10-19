import * as React from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

interface Props {
    cacheName: string
    linkCache: [string]
    onOpen: Function
    onBlur: Function
}

export class LinkSelector extends React.Component<Props> {
    cacheName: string;

    constructor(props: Props){
        super(props);
        this.cacheName = "linkCache"

        this.handleBlur = this.handleBlur.bind(this);
    }

    handleBlur(event){
        this.props.onBlur(this.cacheName, event.target.value);
    }

    render() {
        return (
        <Grid container spacing={2} padding={1}>
            <Grid item width={600}>
                <Autocomplete fullWidth
                    freeSolo
                    id="link-selector"
                    onBlur={this.handleBlur}
                    onOpen={() => {this.props.onOpen(this.props.cacheName)}}
                    options={this.props.linkCache}
                    renderInput={(params) => <TextField
                        {...params}
                        label="Source Link"
                        size="small"
                        InputLabelProps={{...params.InputProps, shrink: true}}
                        variant="standard"
                        />
                    }
                />
            </Grid>
        </Grid>
        );
    }
}