'use strict';

import React from 'react';
import { Button, SecondaryButton } from '../../lib/buttons';
import Panel from 'react-bootstrap/lib/Panel';


let Buttons = React.createClass({

    render() {
        return (
            <div>
                <h2>Button</h2>
                    <p><code>import &#123; Button &#125; from './js/lib/buttons';</code></p>
                    <Panel header='example'>
                        <div>
                            <p>This is a paragraph with
                                <Button>
                                    {"a button"}
                                </Button>
                                that should be displayed inline
                            </p>
                        </div>

                        <div>
                            <p>This is a form with a large submit button
                                <form className="ascribe-form-bordered">
                                    <Button>
                                        {"an inline button"}
                                    </Button>
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
