import * as React from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

interface Props {
    cacheName: string
    currentURL: string
    onClick: Function
}

export class LinkSaveButton extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event){
        this.props.onClick(this.props.cacheName, this.props.currentURL);
    }

    render() {
        return (
        <Grid container spacing={2} padding={1}>
            <Grid item width={600} xs={10}>
                <TextField fullWidth
                id="current-url"
                label="Current URL"
                value={this.props.currentURL}
                size="small"
                InputLabelProps={{shrink: true}}
                InputProps={{readOnly: true}}
                variant="standard"
                />
            </Grid>
            <Grid item xs={2}><button id="link-save-button" onClick={this.handleClick}>Save</button></Grid>
        </Grid>
        );
    }
}