
interface TicketDescriptionProps {
  description: string;
}

export const TicketDescription = ({ description }: TicketDescriptionProps) => {
  return (
    <div>
      <h4 className="font-semibold mb-2">Descrizione</h4>
      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};
