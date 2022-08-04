import React, {useContext, useState, useRef, useEffect} from 'react';
import {Transition} from '@headlessui/react';
import CloseButton from './CloseButton';
import AppContext from '../../AppContext';

const AddNameDialog = (props) => {
    const inputNameRef = useRef(null);
    const inputBioRef = useRef(null);
    const {dispatchAction, member} = useContext(AppContext);

    const [name, setName] = useState(member.name ?? '');
    const [bio, setBio] = useState(member.bio ?? '');

    const maxBioCharsLeft = 50;
    const [bioCharsLeft, setBioCharsLeft] = useState(maxBioCharsLeft);

    const [error, setError] = useState({name: '', bio: ''});

    const close = (succeeded) => {
        dispatchAction('closePopup');
        props.callback(succeeded);
    };

    const submit = async () => {
        // When it's both name and bio
        if (!props.bioOnly) {
            if (name.trim() !== '') {
                await dispatchAction('updateMember', {
                    name,
                    bio
                });
                close(true);
            } else {
                setError({name: 'Enter your name'});
                setName('');
                inputNameRef.current?.focus();
            }
        // When it's only bio
        } else {
            await dispatchAction('updateMember', {
                bio
            });

            close(true);
        }
    };

    // using <input autofocus> breaks transitions in browsers. So we need to use a timer
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!props.bioOnly) {
                inputNameRef.current?.focus();
            } else {
                inputBioRef.current?.focus();
            }
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, [inputNameRef]);

    return (
        <>
            <h1 className="font-sans font-bold tracking-tight text-[24px] mb-3 text-black">Add context to your comments</h1>
            <p className="font-sans text-[1.45rem] text-neutral-500 px-4 sm:px-8 leading-9">For a healthy discussion, let other members know who you are when commenting.</p>
            <section className="mt-8 text-left">
                {!props.bioOnly &&
                    <>
                        <div className="flex flex-row mb-2 justify-between">
                            <label htmlFor="comments-name" className="font-sans font-medium text-sm">Name</label>
                            <Transition
                                show={!!error.name}
                                enter="transition duration-300 ease-out"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition duration-100 ease-out"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="font-sans text-sm text-red-500">{error.name}</div>
                            </Transition>
                        </div>
                        <input
                            id="comments-name"
                            className={`transition-[border-color] duration-200 font-sans px-3 rounded border border-neutral-200 focus:border-neutral-300 w-full outline-0 h-[42px] flex items-center ${error.name && 'border-red-500 focus:border-red-500'}`}
                            type="text"
                            name="name"
                            ref={inputNameRef}
                            value={name}
                            placeholder="Jamie Larson"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setName(e.target.value);
                                    submit();
                                }
                            }}
                            maxLength="64"
                        />
                    </>
                }
                <div className="flex flex-row mt-4 mb-2 justify-between">
                    <label htmlFor="comments-name" className="font-sans font-medium text-sm">Bio</label>
                    <div className={`font-sans text-sm text-neutral-400 ${(bioCharsLeft === 0) && 'text-red-500'}`}><b>{bioCharsLeft}</b> characters left</div>
                </div>
                <input
                    id="comments-bio"
                    className={`transition-[border-color] duration-200 font-sans px-3 rounded border border-neutral-200 focus:border-neutral-300 w-full outline-0 h-[42px] flex items-center ${(bioCharsLeft === 0) && 'border-red-500 focus:border-red-500'}`}
                    type="text"
                    name="bio"
                    ref={inputBioRef}
                    value={bio}
                    placeholder="Head of Marketing at Acme, Inc"
                    onChange={(e) => {
                        let bioText = e.target.value;
                        setBioCharsLeft(maxBioCharsLeft - bioText.length);
                        setBio(bioText);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setBio(e.target.value);
                            submit();
                        }
                    }}
                    maxLength="50"
                />
                <button
                    className="transition-opacity duration-200 ease-linear w-full h-[44px] mt-8 px-8 flex items-center justify-center rounded-md text-white font-sans font-semibold text-[15px] bg-[#3204F5] opacity-100 hover:opacity-90"
                    onClick={submit}
                >
                    Save
                </button>
            </section>
            <CloseButton close={() => close(false)} />
        </>
    );
};

export default AddNameDialog;
