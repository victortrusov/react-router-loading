import React from 'react';
import { LoadingContext } from '../../../dist';
import loadData from './fetchers';

// example with class react component
class Page2Component extends React.Component {
    state = { data: undefined }

    loading = async () => {
        // loading some data
        const data = await loadData();
        this.setState({ data });

        // call method to indicate that loading is done
        this.props.loadingContext.done();
    };

    componentDidMount() {
        this.loading();
    }

    render() {
        return (
            <div>
                <h1>This is page 2 - class component</h1>
                {this.state.data ? 'Loading done!' : 'loading...'}
            </div>
        );
    }
};

// we should wrap class component with Context Provider to get access to loading methods
export const Page2 = (props) =>
    <LoadingContext.Consumer>
        {loadingContext => <Page2Component loadingContext={loadingContext} {...props} />}
    </LoadingContext.Consumer>;
