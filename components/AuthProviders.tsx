'use client';
import { useState, useEffect } from 'react'
import { getProviders, signIn } from 'next-auth/react'

//this is all from next-auth docs
type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
  signinUrlParams: Record<string, string> | null;
}

type Providers = Record<string, Provider>;

const AuthProviders = () => {
  const [providers, setProviders] = useState<Providers | null>(null);

  //fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();

      setProviders(res);
    }

    fetchProviders();
  }, []);

  //check if we have access to providers
  //for each of the sign-in options we should see one provider
  if(providers) {
    return (
      <div>
        {Object.values(providers).map((provider: Provider, i) => (
          <button key={i} onClick={() => signIn(provider?.id)}>
            {provider.id}
          </button>
        ))}
      </div>
    )
  }
}

export default AuthProviders