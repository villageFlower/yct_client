import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import Web3 from 'web3';
import contractABI from '../../assets/yctokenABI.json';

import { ethers } from 'ethers';


function Home() {

    const privateKey = '0944b72c3d92de24b8629ae5f64a2b2ccfa800a2537fb1728781182d61c8dc23';
    const provider = new ethers.JsonRpcProvider('https://goerli.infura.io/v3/9110a9490de6477184406113ce4854a4');
    const contractAddress = '0x67dE3200D39C80D8cc6eA1a35b54b5cfC28748c2';
    const wallet = new ethers.Wallet(privateKey, provider);
    

    const onFinish = async (values) => {
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        const contractWithSigner = contract.connect(wallet);

        // eslint-disable-next-line no-undef
        let amount = BigInt(values.amount) * BigInt(1000000000000000000);

        let data = contractWithSigner.interface.encodeFunctionData('transfer', [values.to_address, amount]);

        let accessList = [
            {
              address: '0x67de3200d39c80d8cc6ea1a35b54b5cfc28748c2',
              storageKeys: [
                '0x26a5a1c41fb12fb7d56fa8cb3d7ec369c783773a4b99dd439e2fd91e2c110738',
                '0xea5abc4e6660da60a3f9cd1c9c5de8791cadf410004533b9f59ab4e753440eae',
              ]
            }
          ]


        let params = {
            to: contractAddress,
            from: wallet.address,
            data: data,
            accesslist: accessList,
        };

        try {
            // const signedTransaction = await wallet.signTransaction(params);
            const transactionResponse = await wallet.sendTransaction(params);
            console.log('Transaction hash:', transactionResponse.hash);
            alert('Transaction hash:' + transactionResponse.hash);
        } catch (error) {
            alert('Error:' + error.message);
            console.error('Error:', error);
        }



    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };






    return (
        <div>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="receiver address"
                    name="to_address"
                    rules={[
                        {
                            required: true,
                            message: 'Please input receiver address!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="token amount" name="amount">
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Transfer
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Home