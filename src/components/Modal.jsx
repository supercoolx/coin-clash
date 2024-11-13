
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from '@radix-ui/react-icons'

export const Modal = ({
	title,
	open,
	onOpenChange,
	children,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
		<Dialog.Portal>
			<Dialog.Overlay
				className="bg-black/10 data-[state=open]:animate-overlayShow fixed inset-0 z-[9]"
				style= {{ backdropFilter: 'blur(9.9px)'}}
			/>
			<Dialog.Content
				className="data-[state=open]:animate-contentShow fixed w-[90%] max-w-[500px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[90vh] rounded-[16px] p-[25px]  focus:outline-none bg-black z-10"
			>
				<Dialog.Title className="hidden" />
			{children}
			<Dialog.Close asChild>
				<button className="absolute top-[13px] right-[13px] text-textSecondary cursor-pointer">
					<Cross1Icon className="w-[16px] h-[16px]" />
				</button>
      </Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
)