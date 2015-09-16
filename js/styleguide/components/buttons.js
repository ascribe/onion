'use strict';

import React from 'react';
import { Button, SecondaryButton, DangerButton } from '../../lib/buttons';
import Panel from 'react-bootstrap/lib/Panel';


let Buttons = React.createClass({

    render() {
        return (
            <div>
                <h2>Button</h2>
                    <p><code>import &#123; Button, SecondaryButton, DangerButton &#125; from './js/lib/buttons';</code></p>
                    <Panel header='example'>
                        <h4>In the wild</h4>
                        <div>
                            <p>This is a paragraph with <Button>{"a button"}</Button> that should be displayed inline</p>
                        </div>

                        <h4>Different states</h4>
                        <div>
                            <Button>button</Button>
                            <Button status="disabled">disabled</Button>
                            <Button status="loading">loading</Button>
                        </div>

                        <h4>In a form</h4>
                        <div>
                            <p>This is a form with a large submit button
                                <form className="ascribe-form-bordered">
                                    <div className="footer">
                                        <Button>
                                            Submit nao
                                        </Button>
                                    </div>
                                </form>
                            </p>
                        </div>

                        <h4>In a form with multiple buttons</h4>
                        <div>
                            <p>This is a form with many buttons
                                <form className="ascribe-form-bordered">
                                    <div className="footer">
                                        <Button>
                                            Submit nao
                                        </Button>

                                        <Button>
                                            Submit later
                                        </Button>

                                        <SecondaryButton>
                                            Cancel
                                        </SecondaryButton>

                                        <DangerButton>
                                            Delete
                                        </DangerButton>
                                    </div>
                                </form>
                            </p>
                        </div>
                    </Panel>

                <div>
                    <SecondaryButton>
                        {"<SecondaryButton>"}
                    </SecondaryButton>
                </div>
            </div>
        );
    }

});

export default Buttons;
