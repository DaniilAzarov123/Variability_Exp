function debriefing_variability(wind1,rect)
%yoffset=input('yoffset ');
yoffset=30;
%instructsize=input('instructsize ');
instructsize=20;
centerx=(rect(3)-rect(1))/2;
centery=(rect(4)-rect(2))/2;
xadjust=70;
%[wind1 rect] = Screen('OpenWindow',0,[100 100 175],[50 50 1700 900]);
% [wind1 rect] = Screen('OpenWindow',0,[100 100 175]);
sent1='Thank you for participating in our experiment.';
sent2='We are interested in what type of training instances  ';
sent3=' allow students to learn categories most effectively. ';
sent4= 'Depending upon the condition that you participated in,  ';
sent5='the training instances that you saw during the study phase ';
sent6=' were either all fairly typical members of their categories  ';
sent7=' or else were quite variable and spread out.'; 
sent8='Although presenting highly typical training instances';
sent9=' makes initial learning easier,';
sent10=' students may have trouble when it comes time to classify ';
sent11=' new items that are less typical of their categories. ';
sent12='Your data will help us to investigate this crucial issue ';
sent13=' involving what type of training instances are best to use. ';
sentlast='PRESS SPACE TO CONTINUE';
blank=' ';
sentence={sent1 sent2 sent3 sent4 sent5 sent6 sent7 sent8 sent9 sent10 sent11 sent12 sent13};
Screen('TextSize',wind1,instructsize);
textbounds_sentlast=Screen('Textbounds',wind1,sentlast);

for i=1:13
    Screen('DrawText',wind1,sentence{i},50,1000-(21-i)*yoffset-400)
end
Screen('DrawText',wind1,sentlast,rect(3)/2-textbounds_sentlast(3)/2,rect(4)-50)
Screen('Flip',wind1)
%%
%      user presses space when ready to start
%
legal=0;
while legal == 0
    [keydown secs keycode]=KbCheck;
    key=KbName(keycode);
    if ischar(key)
    if strcmp(key,'space')
        legal=1;
    end
    end
end
Screen('Flip',wind1)
WaitSecs(.5);


