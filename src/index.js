import cbor from 'cbor';
import multibase from 'multibase';
import _ from 'lodash';

const Keymap = {
    root: {
        'merkleRoot': 0,
        'targetHash': 1,
        'anchors': 2,
        'path': 3
    },
    path: {
        'left': 0,
        'right': 1
    },
    chain: {
        btc: {
            id: 0,
            networks: {
                mainnet: 1,
                testnet: 3
            }
        },
        eth: {
            id: 1,
            networks: {
                mainnet: 1,
                ropsten: 3,
                rinkeby: 4
            }
        },
        mtc: {
            id: 2,
            networks: {
                mainnet: 137,
                mumbai: 80001
            }
        }
    }
};

function constructPathJSON (path) {
    const pathKeymap = _.invert(Keymap.path)
    return path.map(item => {
        return {
            [pathKeymap[item[0]]]: cbor.decode(item[1]).toString('hex')
        }
    })
}

function constructAnchorsJSON (anchors) {
    const chainKeymap = _.invertBy(Keymap.chain, (value) => value.id)

    return anchors.map((anchor) =>
        anchor.reduce((acc, val) => {
            if (val[0] === 0) {
                return `${acc}:${chainKeymap[val[1]]}`
            }
            if (val[0] === 1) {
                const chain = acc.split(':').pop()
                const networkKeymap = _.invert(Keymap.chain[chain].networks)
                return `${acc}:${networkKeymap[val[1]]}`
            }

            return `${acc}:${cbor.decode(val[1]).toString('hex')}`
        }, 'blink')
    )
}

function constructRootJSON (decoded) {
    const rootKeymap = _.invert(Keymap.root)

    return decoded.reduce((acc, val) => {
        const key = rootKeymap[val[0]]
        let value = val[1]

        if (value instanceof Array) {
            if (key === 'anchors') {
                value = constructAnchorsJSON(value)
            }
            if (key === 'path') {
                value = constructPathJSON(value)
            }
        }

        if (value instanceof Buffer) {
            value = cbor.decode(value).toString('hex')
        }

        acc[key] = value
        return acc
    }, {})
}

export default function decode (base58string) {
    const encoded = multibase.decode(base58string)
    const map = cbor.decode(encoded)
    const json = constructRootJSON(map)

    return json
}
