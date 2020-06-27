import React, { ReactChildren } from 'react';
import { Button } from "react-bootstrap";

interface IUploadButtonProps {
	accept?: string | undefined,
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
	children?: React.ReactNode | undefined,
}

const UploadButton = (props: IUploadButtonProps) => {
	return (
		<div>
			<input
				accept={props.accept ? props.accept : "*"}
				style={{ display: 'none' }}
				id="file-input"
				multiple
				type="file"
				onChange={props.onChange}
			/>
			<label htmlFor="file-input">
				<Button
					variant="outline-secondary"
					as="span"
					style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
				>
					{props.children}
				</Button>
			</label>
		</div>
	);
}

export default UploadButton;
