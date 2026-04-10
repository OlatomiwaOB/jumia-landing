import { useAccount, useConnect, useDisconnect } from "wagmi"

export const ConnectButton = () => {
  const { address } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  console.log(connectors);
  console.log(address);
  
  

  return (
    <div>
      {address ? (
        <button onClick={() => disconnect()}>Disconnect</button>
      ) : (
        connectors.map(connector => (
          <button key={connector.uid} className="bg-green-400 text-white" onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        ))
      )}
    </div>
  )
}