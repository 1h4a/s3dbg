import { ConfigInterface, RequestInterface } from "@/components/interface";

export default function Home() {
    return (<span className="flex flex-col w-full h-full items-start justify-start">
        <RequestInterface />
        <ConfigInterface />
    </span>);
}
