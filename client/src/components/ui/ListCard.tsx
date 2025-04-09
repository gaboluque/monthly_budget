
interface ListCardProps {
    icon: React.ReactNode;
    title: React.ReactNode;
    description: React.ReactNode;
    amount: React.ReactNode;
    onClick?: () => void;
}

export const ListCard = ({ icon, title, description, amount, onClick }: ListCardProps) => {
    return (
        <div className="flex items-center p-4 rounded-lg border border-gray-100 shadow-sm bg-white" onClick={onClick}>
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                {icon}
            </div>
            <div className="flex-1 ml-4">
                <div className="text-md font-medium text-gray-900">{title}</div>
                <div className="mt-1 text-sm text-gray-500">{description}</div>
            </div>
            <div className="text-right">
                <div className="text-md font-medium text-gray-900">{amount}</div>
            </div>
        </div>
    )
}