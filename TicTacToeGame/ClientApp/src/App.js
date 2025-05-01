import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';

import TicTacToe from './TicTacToe/TicTacToe';
import './TicTacToe/TicTacToe.css';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <div className="App">
                <TicTacToe />

                <Layout>
                    <Routes>
                        {AppRoutes.map((route, index) => {
                            const { element, ...rest } = route;
                            return <Route key={index} {...rest} element={element} />;
                        })}
                    </Routes>
                </Layout>
            </div>

        );
    }
}
