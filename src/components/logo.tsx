import Image from 'next/image'

export const Logo  = () => {
    return (
        <div className="flex">
            <Image src="/logo.svg" alt="me" width="100" height="64" />
        </div>
    )
}
